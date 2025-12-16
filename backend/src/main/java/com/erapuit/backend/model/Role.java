package com.erapuit.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private RoleType name;

    @Column
    private String description;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    // Constructors
    public Role() {}

    public Role(RoleType name) {
        this.name = name;
    }

    public Role(RoleType name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public RoleType getName() { return name; }
    public void setName(RoleType name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    // Enum for Role Types
    public enum RoleType {
        ROLE_DEVELOPER("Developer with full system access - cannot be deleted"),
        ROLE_ADMIN("Administrator with full system access"),
        ROLE_USER("User with standard access");

        private final String displayName;

        RoleType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
