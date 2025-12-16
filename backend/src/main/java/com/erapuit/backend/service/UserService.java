package com.erapuit.backend.service;

import com.erapuit.backend.model.Role;
import com.erapuit.backend.model.User;
import com.erapuit.backend.repository.RoleRepository;
import com.erapuit.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(String username, String password, Set<Role.RoleType> roleTypes) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User(username, passwordEncoder.encode(password));

        for (Role.RoleType roleType : roleTypes) {
            Role role = roleRepository.findByName(roleType)
                    .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleType));
            user.addRole(role);
        }

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User updateUser(UUID id, Set<Role.RoleType> roleTypes) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Update roles
        user.getRoles().clear();
        for (Role.RoleType roleType : roleTypes) {
            Role role = roleRepository.findByName(roleType)
                    .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleType));
            user.addRole(role);
        }

        return userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Prevent deletion of users with ROLE_DEVELOPER
        boolean hasDeveloperRole = user.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.RoleType.ROLE_DEVELOPER);
        
        if (hasDeveloperRole) {
            throw new IllegalArgumentException("Cannot delete users with Developer role");
        }
        
        // Clear roles before deleting user
        user.getRoles().clear();
        userRepository.save(user);
        
        // Now delete the user
        userRepository.deleteById(id);
    }

    public void changePassword(UUID userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }


}
