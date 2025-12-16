package com.erapuit.backend.dto;

import java.util.Set;
import java.util.UUID;

public class UserResponse {
    private UUID id;
    private String username;
    private Set<String> roles;
    private String allowedPages;

    public UserResponse(UUID id, String username, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.allowedPages = "";
    }

    public UserResponse(UUID id, String username, Set<String> roles, String allowedPages) {
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.allowedPages = allowedPages != null ? allowedPages : "";
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }


    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public String getAllowedPages() { return allowedPages != null ? allowedPages : ""; }
    public void setAllowedPages(String allowedPages) { this.allowedPages = allowedPages != null ? allowedPages : ""; }
}
