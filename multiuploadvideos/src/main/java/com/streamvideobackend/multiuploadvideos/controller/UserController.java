package com.streamvideobackend.multiuploadvideos.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.streamvideobackend.multiuploadvideos.dto.User;
import com.streamvideobackend.multiuploadvideos.service.UserService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {
	private final UserService userService;

	@PostMapping("/user")
	public ResponseEntity<User> postUser(@RequestParam String name, @RequestParam String email,
			@RequestParam String password, @RequestParam String biodetails, @RequestParam String country,
			@RequestParam(required=false) MultipartFile profilePic) {
		try {
			User user = userService.postUser(name, email, password, biodetails, country, profilePic);
			return ResponseEntity.ok(user);

		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	@PatchMapping("/user/{id}")
	public ResponseEntity<User> updateImage(@PathVariable int id, @RequestParam MultipartFile profilePic) {

		try {
			User user = userService.updateUserProfileImage(id, profilePic);
			return ResponseEntity.ok(user);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

//   public User postUser(@RequestBody User user) {
//	   return userService.postUser(user);
//   }
	@PatchMapping("/userdet/{id}")
	public ResponseEntity<User> updateCredentials(@PathVariable int id, @RequestParam String name,
			@RequestParam String password, @RequestParam String biodetails, @RequestParam String country) {
		try {
			User user = userService.updateDataUser(id, name, password, biodetails, country);
			return ResponseEntity.ok(user);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().build();
		}
	}

	@GetMapping("/users")
	public List<User> seeAllUsers() {
		return userService.getAllUsers();
	}

	@GetMapping("/user/{id}")
	public ResponseEntity<?> seeUserById(@PathVariable int id) {
		User user = userService.getUserById(id);
		if (user == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok(user);
		}
	}

	@PostMapping("/verify-by-pass")
	public ResponseEntity<?> verifyUser(@RequestParam String email, @RequestParam String password) {
		User user = userService.verifypass(email, password);
		if (user == null) {
			return ResponseEntity.notFound().build();
		} else {
			return ResponseEntity.ok(user);
		}
	}

	@DeleteMapping("/user/{id}")
	public ResponseEntity<?> eraseUserById(@PathVariable int id) {
		try {
			userService.deleteUserById(id);
			return new ResponseEntity<>("Deleted Successfully", HttpStatus.OK);
		} catch (EntityNotFoundException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
		}
	}

//   @PatchMapping("/user/{id}")
//   public ResponseEntity<?> updateUserRecord(@PathVariable int id,@RequestBody User user){
//	   User updateUser = userService.updateUser(id, user);
//	   if(updateUser == null) {
//		   return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//	   }else {
//		   return ResponseEntity.ok(updateUser);
//	   }
//   }

	@GetMapping("/user/image/{id}")
	public ResponseEntity<Resource> getProfileImage(@PathVariable int id) throws IOException {
		Resource image = userService.loadImage(id);

		// Detect file type dynamically
		Path imagePath = Paths.get(image.getFile().getAbsolutePath());
		String contentType = Files.probeContentType(imagePath);

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType))
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + image.getFilename() + "\"")
				.body(image);
	}

	@DeleteMapping("/user/delpro/{userId}")
	public ResponseEntity<String> deleteUserProfileImage(@PathVariable int userId) {
		try {
			userService.deleteUserProfileImage(userId);
			return ResponseEntity.ok("Profile picture deleted successfully.");
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("Error deleting profile picture: " + e.getMessage());
		}
	}

}
