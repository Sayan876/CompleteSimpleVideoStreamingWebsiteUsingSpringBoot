package com.streamvideobackend.multiuploadvideos.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.streamvideobackend.multiuploadvideos.dto.User;
import com.streamvideobackend.multiuploadvideos.dto.Video;
import com.streamvideobackend.multiuploadvideos.repository.UserRepository;
import com.streamvideobackend.multiuploadvideos.repository.VideoRepository;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	
	private final VideoService videoService; 

	@Value("${file.upload-dir}")
	private String uploadDir;

	@PostConstruct
	public void init() {
		File folder = new File(uploadDir);
		if (!folder.exists()) {
			folder.mkdir();
			System.out.println("Folder has been created!");
		} else {
			System.out.println("Folder already exists");
		}
	}

	public User postUser(String name, String email, String password, String biodetails, String country, MultipartFile profilePic) {
		User user = new User();

		user.setName(name);
		user.setEmail(email);
		user.setPassword(password);
		user.setBiodetails(biodetails);
		user.setCountry(country);
		try {
			String filename = profilePic.getOriginalFilename();
			String contentType = profilePic.getContentType();
			InputStream inputStream = profilePic.getInputStream();

			String cleanFileName = StringUtils.cleanPath(filename);
			String cleanFolder = StringUtils.cleanPath(uploadDir);

			Path path = Paths.get(uploadDir, cleanFileName);
			Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);

			user.setProfilePicPath(path.toString());
			System.out.println("File uploaded: " + path);

		} catch (IOException e) {
			e.printStackTrace();
		}

		return userRepository.save(user);
	}



	public User updateUserProfileImage(int userId, MultipartFile newProfilePic) {
		// 1. Retrieve existing user from DB
		Optional<User> optionalUser = userRepository.findById(userId);
		if (optionalUser.isEmpty()) {
			throw new RuntimeException("User not found with ID: " + userId);
		}

		User user = optionalUser.get();

		try {
			// 2. Delete old image if it exists
			if (user.getProfilePicPath() != null) {
				Path oldImagePath = Paths.get(user.getProfilePicPath());
				if (Files.exists(oldImagePath)) {
					Files.delete(oldImagePath);
					System.out.println("Old profile picture deleted: " + oldImagePath);
				}
			}

			// 3. Save the new image
			String filename = StringUtils.cleanPath(newProfilePic.getOriginalFilename());
			Path newPath = Paths.get(uploadDir, filename);

			// Overwrite existing file with the same name
			Files.copy(newProfilePic.getInputStream(), newPath, StandardCopyOption.REPLACE_EXISTING);

			// 4. Update database reference
			user.setProfilePicPath(newPath.toString());

			System.out.println("Profile image updated: " + newPath);

			// 5. Save updated user
			return userRepository.save(user);

		} catch (IOException e) {
			throw new RuntimeException("Failed to update profile image for user ID: " + userId, e);
		}
	}

	public User updateDataUser(int id, String name, String password, String biodetials, String country) {
		Optional<User> optionalUser = userRepository.findById(id);
		if (optionalUser.isEmpty()) {
			throw new RuntimeException("User not found with ID: " + id);
		}

		User user = optionalUser.get();
		try {
			user.setName(name);
			user.setPassword(password);
			user.setBiodetails(biodetials);
			user.setCountry(country);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return userRepository.save(user);

	}

	public List<User> getAllUsers() {
		return userRepository.findAll();
		
	}

	public User getUserById(int id) {
		return userRepository.findById(id).orElse(null);
	}

//	public void deleteUserById(int id) {
//		if (!userRepository.existsById(id)) {
//			throw new EntityNotFoundException(id + " couldn't find that");
//		} else {
//			userRepository.deleteById(id);
//		}
//	}
	
	
	public void deleteUserById(int id) {
        // Check if user exists
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            throw new EntityNotFoundException("User with ID " + id + " not found");
        }

        User user = userOpt.get();

        // Step 1: Delete all videos belonging to this user
        List<Video> videos = videoService.getVideoByUserIdNumber(id);
        for (Video v : videos) {
            videoService.deleteVideoById(v.getVideoId());
        }

        // Step 2: Delete the user record itself
        userRepository.delete(user);
        System.out.println("Deleted user and all associated videos successfully!");
    }

//	public User updateUser(int id, User user) {
//		Optional<User> optUser = userRepository.findById(id);
//		if(optUser.isPresent()) {
//			User existingUser = optUser.get();
//			existingUser.setName(user.getName());
//			existingUser.setPassword(user.getPassword());
//			existingUser.setEmail(user.getEmail());
//			return userRepository.save(existingUser);
//		}
//		return null; 
//	}

	// To get the image
	public Resource loadImage(int userId) throws MalformedURLException {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("Person not found with ID: " + userId));

		if (user.getProfilePicPath() == null) {
			throw new RuntimeException("This user has no profile picture uploaded.");
		}

		Path imagePath = Paths.get(user.getProfilePicPath());
		Resource resource = new UrlResource(imagePath.toUri());

		if (resource.exists() && resource.isReadable()) {
			return resource;
		} else {
			throw new RuntimeException("Could not read file: " + imagePath);
		}
	}

	public User verifypass(String email, String password) {
		return userRepository.verifyByUser(email, password);
	}
	
	public User deleteUserProfileImage(int userId) {
	    // 1. Retrieve existing user from DB
	    Optional<User> optionalUser = userRepository.findById(userId);
	    if (optionalUser.isEmpty()) {
	        throw new RuntimeException("User not found with ID: " + userId);
	    }

	    User user = optionalUser.get();

	    try {
	        // 2. Delete the profile picture file if it exists
	        if (user.getProfilePicPath() != null) {
	            Path imagePath = Paths.get(user.getProfilePicPath());
	            if (Files.exists(imagePath)) {
	                Files.delete(imagePath);
	                System.out.println("Profile picture deleted: " + imagePath);
	            } else {
	                System.out.println("Profile picture file not found: " + imagePath);
	            }
	        } else {
	            System.out.println("User does not have a profile picture to delete.");
	        }

	        // 3. Remove reference in DB
	        user.setProfilePicPath(null);

	        // 4. Save updated user
	        return userRepository.save(user);

	    } catch (IOException e) {
	        throw new RuntimeException("Failed to delete profile picture for user ID: " + userId, e);
	    }
	}

}
