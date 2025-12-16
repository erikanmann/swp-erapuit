package com.erapuit.backend.controller;

import com.erapuit.backend.dto.CreateUserRequest;
import com.erapuit.backend.dto.LoginRequest;
import com.erapuit.backend.dto.LoginResponse;
import com.erapuit.backend.dto.UserResponse;
import com.erapuit.backend.dto.ChangePasswordRequest;
import com.erapuit.backend.model.Role;
import com.erapuit.backend.model.User;
import com.erapuit.backend.repository.RoleRepository;
import com.erapuit.backend.security.JwtTokenProvider;
import com.erapuit.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            User user = userService.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = tokenProvider.generateToken(user.getUsername(), user.getId().toString());

            return ResponseEntity.ok(new LoginResponse(token, user.getUsername()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        try {
            // Check if current user has permission to create users with ROLE_ADMIN
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Current user not found"));
            
            boolean currentUserIsDeveloper = currentUser.getRoles().stream()
                    .anyMatch(role -> role.getName() == Role.RoleType.ROLE_DEVELOPER);
            boolean requestHasRoleAdmin = request.getRoles() != null && request.getRoles().contains("ROLE_ADMIN");
            
            if (!currentUserIsDeveloper && requestHasRoleAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only developers can create users with admin role");
            }

            // Validation: user must have access to at least one page
            if (request.getAllowedPages() == null || request.getAllowedPages().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User must have access to at least one page");
            }

            // Validation: ROLE_USER cannot have "users" page access
            boolean hasRoleUser = request.getRoles() != null && request.getRoles().contains("ROLE_USER");
            boolean hasUsersPageAccess = request.getAllowedPages().contains("users");
            
            if (hasRoleUser && hasUsersPageAccess) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Users with role ROLE_USER cannot have access to 'users' page");
            }

            Set<Role.RoleType> roleTypes = new HashSet<>();
            if (request.getRoles() != null) {
                for (String roleStr : request.getRoles()) {
                    roleTypes.add(Role.RoleType.valueOf(roleStr));
                }
            } else {
                roleTypes.add(Role.RoleType.ROLE_USER);
            }

            User newUser = userService.createUser(
                    request.getUsername(),
                    request.getPassword(),
                    roleTypes
            );

            // Ensure home and profile pages are always included, then add other allowed pages
            List<String> allowedPages = new ArrayList<>(Arrays.asList(request.getAllowedPages().split(",")));
            if (!allowedPages.contains("home")) {
                allowedPages.add(0, "home");
            }
            if (!allowedPages.contains("profile")) {
                allowedPages.add("profile");
            }
            newUser.setAllowedPages(String.join(",", allowedPages));
            userService.updateUser(newUser);

            Set<String> roleNames = newUser.getRoles().stream()
                    .map(r -> r.getName().name())
                    .collect(Collectors.toSet());

            UserResponse response = new UserResponse(
                    newUser.getId(),
                    newUser.getUsername(),
                    roleNames,
                    newUser.getAllowedPages()
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
                List<User> users = userService.findAll();
                List<UserResponse> responses = users.stream()
                    .map(user -> {
                    Set<String> roleNames = user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(Collectors.toSet());
                    return new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        roleNames,
                        user.getAllowedPages()
                    );
                    })
                    .collect(Collectors.toList());
                return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        try {
            User user = userService.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

                Set<String> roleNames = user.getRoles().stream()
                    .map(r -> r.getName().name())
                    .collect(Collectors.toSet());

                UserResponse response = new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    roleNames,
                    user.getAllowedPages()
                );

                return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        try {
            // Get the current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            User currentUser = userService.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("Current user not found"));

            // Get the user to be deleted
            User userToDelete = userService.findById(id)
                    .orElseThrow(() -> new RuntimeException("User to delete not found"));

            // Check if the user to delete has ROLE_DEVELOPER (cannot be deleted)
            boolean hasRoleDeveloper = userToDelete.getRoles().stream()
                    .anyMatch(role -> role.getName() == Role.RoleType.ROLE_DEVELOPER);
            if (hasRoleDeveloper) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot delete users with ROLE_DEVELOPER");
            }

            // Check current user's permissions
            boolean currentUserIsDeveloper = currentUser.getRoles().stream()
                    .anyMatch(role -> role.getName() == Role.RoleType.ROLE_DEVELOPER);
            boolean currentUserIsAdmin = currentUser.getRoles().stream()
                    .anyMatch(role -> role.getName() == Role.RoleType.ROLE_ADMIN);

            if (currentUserIsDeveloper) {
                // ROLE_DEVELOPER can delete ROLE_ADMIN and ROLE_USER
                userService.deleteUser(id);
                return ResponseEntity.ok("User deleted successfully");
            } else if (currentUserIsAdmin) {
                // ROLE_ADMIN can only delete ROLE_USER users
                boolean targetIsUser = userToDelete.getRoles().stream()
                        .anyMatch(role -> role.getName() == Role.RoleType.ROLE_USER);
                if (targetIsUser) {
                    userService.deleteUser(id);
                    return ResponseEntity.ok("User deleted successfully");
                } else {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin cannot delete admin user");
                }
            } else {
                // ROLE_USER cannot delete anyone
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to delete users");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete user failed: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable UUID id, @RequestBody CreateUserRequest request) {
        try {
            // Check if current user has permission to update users with ROLE_ADMIN
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Current user not found"));
            
            boolean currentUserIsDeveloper = currentUser.getRoles().stream()
                    .anyMatch(role -> role.getName() == Role.RoleType.ROLE_DEVELOPER);
            boolean requestHasRoleAdmin = request.getRoles() != null && request.getRoles().contains("ROLE_ADMIN");
            
            if (!currentUserIsDeveloper && requestHasRoleAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only developers can assign admin role to users");
            }

            // Check if current user is admin trying to change password of another admin
            User user = userService.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            boolean currentUserIsAdmin = currentUser.getRoles().stream()
                    .anyMatch(role -> role.getName() == Role.RoleType.ROLE_ADMIN);
            boolean targetUserIsAdmin = user.getRoles().stream()
                    .anyMatch(role -> role.getName() == Role.RoleType.ROLE_ADMIN);
            
            if (currentUserIsAdmin && targetUserIsAdmin && request.getPassword() != null && !request.getPassword().isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin users cannot change the password of other admin users");
            }

            // Check if current user is admin trying to change username of another admin
            if (currentUserIsAdmin && targetUserIsAdmin && request.getUsername() != null && !request.getUsername().isEmpty() && !request.getUsername().equals(user.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin users cannot change the username of other admin users");
            }

            // Validation: user must have access to at least one page
            if (request.getAllowedPages() == null || request.getAllowedPages().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User must have access to at least one page");
            }

            // Validation: ROLE_USER cannot have "users" page access
            boolean hasRoleUser = request.getRoles() != null && request.getRoles().contains("ROLE_USER");
            boolean hasUsersPageAccess = request.getAllowedPages().contains("users");
            
            if (hasRoleUser && hasUsersPageAccess) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Users with role ROLE_USER cannot have access to 'users' page");
            }

            // Update username if provided
            if (request.getUsername() != null && !request.getUsername().isEmpty()) {
                user.setUsername(request.getUsername());
            }

            // Update password if provided
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            }

            // Update roles if provided
            if (request.getRoles() != null && !request.getRoles().isEmpty()) {
                Set<Role> roles = new HashSet<>();
                for (String roleStr : request.getRoles()) {
                    Role.RoleType roleType = Role.RoleType.valueOf(roleStr);
                    Role role = roleRepository.findByName(roleType)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + roleStr));
                    roles.add(role);
                }
                user.setRoles(roles);
            }

            // Update allowed pages if provided, ensuring home and profile pages are always included
            if (!request.getAllowedPages().isEmpty()) {
                List<String> allowedPages = new ArrayList<>(Arrays.asList(request.getAllowedPages().split(",")));
                if (!allowedPages.contains("home")) {
                    allowedPages.add(0, "home");
                }
                if (!allowedPages.contains("profile")) {
                    allowedPages.add("profile");
                }
                user.setAllowedPages(String.join(",", allowedPages));
            }

            userService.updateUser(user);

            Set<String> roleNames = user.getRoles().stream()
                    .map(r -> r.getName().name())
                    .collect(Collectors.toSet());

            UserResponse response = new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    roleNames,
                    user.getAllowedPages()
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update user failed: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Current password is incorrect");
            }

            // Update password
            String hashedPassword = passwordEncoder.encode(request.getNewPassword());
            user.setPasswordHash(hashedPassword);
            userService.updateUser(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error changing password: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

                Set<String> roleNames = user.getRoles().stream()
                    .map(r -> r.getName().name())
                    .collect(Collectors.toSet());

                UserResponse response = new UserResponse(
                    user.getId(),
                    user.getUsername(),
                    roleNames,
                    user.getAllowedPages()
                );

                return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/user-roles")
    public ResponseEntity<?> getUserRoles() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Map<String, String>> roles = user.getRoles().stream()
                    .map(role -> {
                        Map<String, String> roleMap = new HashMap<>();
                        roleMap.put("name", role.getName().name());
                        roleMap.put("description", role.getDescription());
                        return roleMap;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}

