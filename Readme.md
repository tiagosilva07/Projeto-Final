# 📘 Blog Platform – Spring Boot + React

A full‑stack blog platform built with **Spring Boot**, **Spring Security**, **JWT authentication**, and a **React frontend**.  
The project supports user registration, authentication, profile management, post creation, comments, categories, and admin‑level actions such as promoting/demoting users.

---

## 🚀 Features

### 👤 User Management
- Register new users  
- Login with JWT authentication  
- Update profile  
- View own profile  
- Admin actions: 
  - some metrics overview
  - promote/demote users
  - create / update / delete / posts
  - create / update / delete / comments 

### 📝 Posts
- Create, update, delete posts  
- Add images, categories, and metadata  
- View all posts or filter by category  
- View post details  

### 💬 Comments
- Add comments to posts  
- View comments per post
- User can delete own comments  

### 🏷️ Categories
- Preloaded categories  
- Posts can belong to multiple categories  

### 🔐 Security
- Spring Security with JWT  
- Custom `UserDetailsImpl`  
- Role‑based access control (`USER`, `ADMIN`)  
- Custom annotation for testing authenticated endpoints  

---

## 🛠️ Tech Stack

### Backend
- Java 25  
- Spring Boot  
- Spring Security  
- Spring Data JPA  
- JWT Authentication  
- H2  
- JUnit + Mockito + MockMvc  

### Frontend
- React  
- Fetch  
- React Router  
- Tailwind / CSS
- Shadcn  

---

## 🧪 Testing

The project includes:
- Unit tests for controllers  
- Custom annotation `@WithMockUserDetailsImpl` to simulate authenticated users  
- MockMvc for endpoint testing  
- Mockito for service mocking  

Example:

```java
@WithMockUserDetailsImpl(username = "john")
void shouldUpdateUserProfile() throws Exception {
    when(userService.updateUser(any(), any())).thenReturn(userResponseDTO);

    mockMvc.perform(put("/api/users/profile")
            .contentType(MediaType.APPLICATION_JSON)
            .content(VALID_USER_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("john@mail.com"));
}
```

---

## 🗄️ Database Seeding

The project includes a fully rewritten `data.sql` with:
- No explicit IDs  
- Hibernate auto‑generating primary keys  
- All relationships preserved  
- Clean and safe for production  

---

## 📂 Project Structure

```
src/main/java/pt/tiago/blog
│
├── controllers
├── services
├── repositories
├── models
├── configurations
├── payload (DTOs)
└── utils
```

---

## ▶️ How to Run

### Backend
```
mvn spring-boot:run
```

### Frontend
```
npm install
npm start
```

---

## 👨‍💻 Author

**Tiago Silva**  
Full‑stack developer passionate about clean architecture, testing, and modern web development.
