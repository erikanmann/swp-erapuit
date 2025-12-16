package com.erapuit.backend.dto;

import java.util.Set;

public class CreateUserRequest {
    private String username;
    private String password;
    private Set<String> roles; // e.g., ["ROLE_ADMIN", "ROLE_USER"]
    private String allowedPages = ""; // Comma-separated page IDs

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }


    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public String getAllowedPages() { return allowedPages != null ? allowedPages : ""; }
    public void setAllowedPages(String allowedPages) { this.allowedPages = allowedPages != null ? allowedPages : ""; }
}
