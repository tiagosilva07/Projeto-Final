package pt.tiago.blog.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;


@Entity
@Table(name="persons")
public class Person extends BaseEntity {

    @Column(name = "name")
    private String name;
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    @OneToOne(mappedBy = "person")
    User user;

    public Person() {}

    public Person(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
