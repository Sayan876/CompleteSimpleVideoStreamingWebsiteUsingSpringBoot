package com.streamvideobackend.multiuploadvideos.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.streamvideobackend.multiuploadvideos.dto.User;
import com.streamvideobackend.multiuploadvideos.dto.Video;


@Repository
public interface VideoRepository extends JpaRepository<Video, String> {
	
	
	//("select u.videos from User u where u.id=?1")
	//@Query("SELECT v FROM User u JOIN u.videos v WHERE u.id =?1 ORDER BY v.uploadedAt DESC")
	@Query("SELECT v FROM User u JOIN u.videos v WHERE u.id=?1 ORDER BY v.uploadedAt DESC ")
	public List<Video> getVideosByUserId(int id);
	
//	@NativeQuery("SELECT * FROM newvidbase.video where user_id=(select id from newvidbase.user where email='sayan43245@gmail.com' and password='abcd' );")
	@Query("select u.videos from User u where u.email=?1 and u.password=?2")
	public List<Video> getVideosByUserEmailandPassword(String email, String password);
	
	
//	@NativeQuery("DELETE FROM secondvideobase.video WHERE video_id=?;")
//	public Video deleteVideoById(String videoId);
	
	@Query("update Video v set v.title=?1,v.description=?2 where v.videoId=?3 ")
	public Video updateTitleorDescr(String title, String description, String videoId);
	
	@Query("SELECT v.user.id FROM Video v WHERE v.videoId = ?1")
	int findUserIdByVideoId(String videoId);
	
	@Query("SELECT v FROM Video v ORDER BY v.uploadedAt DESC")
	public List<Video> findAllVideosOrderByUploadedAtDesc();
	
	@Query("SELECT v FROM Video v WHERE v.title=?1")
	public List<Video> getVideosByTitle(String title);
	
	@Query("SELECT v.user FROM Video v WHERE v.videoId=?1")
	public User findUserByVideoId(String videoId);

	
	
	

}
