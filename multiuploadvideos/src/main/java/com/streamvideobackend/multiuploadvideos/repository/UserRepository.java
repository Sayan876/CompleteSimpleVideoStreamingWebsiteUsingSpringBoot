package com.streamvideobackend.multiuploadvideos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.streamvideobackend.multiuploadvideos.dto.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	
	
	@Query("select u from User u where u.email=?1  and u.password=?2 ")
	public User verifyByUser(String email, String pass);
	
	
//	@NativeQuery("UPDATE secondvideobase.user SET name=?1, password=?2, biodetails=?3, country=?4 where id=?5;")
	@Query("update User u set u.name=?1,u.password=?2,u.biodetails=?3,u.country=?4 where u.id=?5")
	public User updateDetails(String name, String pass, String biodetails, String country, int id);
	
	

	
//	@Query("select u.name from User u")
//	public List<User> getAllExceptPassword();

}
