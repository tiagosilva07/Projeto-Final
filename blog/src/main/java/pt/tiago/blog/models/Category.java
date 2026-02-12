package pt.tiago.blog.models;


import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "categories")
public class Category  extends BaseEntity {

    @Column(name ="name", nullable = false,length=100,unique=true)
    private String name;
    @Column(name ="description", nullable = false,length=255)
    private String description;

    @ManyToMany(fetch = FetchType.LAZY,mappedBy = "categories")
    private Set<Post> posts = new HashSet<>();

    public Category() {}

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Post> getPosts() {
        return posts;
    }

    public void setPosts(Set<Post> posts) {
        this.posts = posts;
    }

    @Override
    public String toString() {
        return "Category Id: " + this.getId()
                + "Name: "+ this.getName()
                + " Description: " + this.getDescription()
                + " Posts: " + this.getPosts();
    }
}
