import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  query,
  where,
  deleteDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "./index";

export const addPost = async (image, uId, caption, type) => {
  try {
    const res = await fetch(image);

    if (!res.ok) {
      throw new Error(`Failed to fetch the image. Status: ${res.status}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.startsWith("video/")) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const blob = await res.blob();

    const storage = getStorage();
    const fileName = `${new Date().getTime()}_${uId}`;
    const imageRef = ref(
      storage,
      `${type === "posts" ? "images" : "displayPic"}/${uId}/${fileName}`
    );

    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);

    const date = new Date();
    const dateFormat = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const timeFormat = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    if (type === "posts") {
      const userPostsCollectionRef = collection(db, "users", uId, "posts");
      await addDoc(userPostsCollectionRef, {
        imageUrl: imageUrl,
        createDate: dateFormat,
        createdTime: timeFormat,
        likes: 0,
        caption: caption,
        path: imageRef.fullPath,
      })
        .then(() => {})
        .catch((err) => {
          console.log("err added", err.message);
        });
    } else {
      const updateUserProfileRef = doc(db, "users", uId);
      await updateDoc(updateUserProfileRef, {
        userImage: imageUrl,
      });
      const followingRef = collection(db, "users", uId, "following");
      const followingDoc = await getDocs(followingRef);
      let following = followingDoc.docs.map((doc) => doc.id);
      following.forEach(async (data) => {
        let result = data.replace(uId, "");
        let ref = doc(db, "users", result, "following", `${uId + result}`);
        try {
          await updateDoc(ref, {
            newUserImage: imageUrl,
          });
        } catch (error) {
          console.error(`Error updating document for user: ${result}`, error);
        }
      });
      return imageUrl;
    }
  } catch (error) {
    console.error("Error uploading post:", error.message);
    throw error;
  }
};

export const deletePost = async (path, imageId, userId) => {
  const storage = getStorage();
  const imageRef = ref(storage, path);
  try {
    await deleteObject(imageRef);
    const ref = doc(db, "users", userId, "posts", imageId);
    await deleteDoc(ref);
  } catch (error) {
    console.log(error.message);
  }
};

export const editPost = async (imageUrl, caption, userId, imageId, path) => {
  if (imageUrl.startsWith("data:")) {
    await deletePost(path, imageId, userId);
    await addPost(imageUrl, userId, caption, "posts");
  } else {
    const updateCaptionRef = doc(db, "users", userId, "posts", imageId);
    await updateDoc(updateCaptionRef, {
      caption: caption,
    });
  }
};

export const getPosts = async (id, type) => {
  try {
    if (id && type === "userPost") {
      const postRef = collection(db, "users", id, "posts");
      const postsSnapshot = await getDocs(postRef);
      const userPosts = postsSnapshot.docs.map((doc) => ({
        caption:doc.data().caption,
        imageUrl:doc.data().imageUrl
      
      }));
      
      return userPosts
    } else {
      try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const userIds = usersSnapshot.docs.map((doc) => doc.data().uId);

        let allUserPosts = [];

        for (const userId of userIds) {
          const userPostsRef = collection(db, "users", userId, "posts");
          const userPostsSnapshot = await getDocs(userPostsRef);

          const userPosts = userPostsSnapshot.docs.map((doc) => ({
            caption: doc.data().caption,
            url: doc.data().imageUrl,
          }));

          allUserPosts = allUserPosts.concat(userPosts);
        }
        return allUserPosts;
      } catch (error) {
        console.error("Error fetching user posts: ", error);
      }
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
