import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { useAppStore } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  DELETE_PROFILE_IMAGE,
  UPDATE_PROFILE_ROUTE,
  UPLOAD_PROFILE_IMAGE,
} from "@/util/constants";
import { HOST } from "@/util/constants";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [hovered, setHovered] = useState(false);

  const fileRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo?.image) {
      // Build valid URL for preview
      const url = userInfo.image.startsWith("http")
        ? userInfo.image
        : `${HOST}/${userInfo.image}`;
      setImage(url);
    }
  }, [userInfo]);
  const handleFileInput = () => {
    fileRef.current.click();
  };

  const handleImageUpdate = async (e) => {
    const image = e.target.files[0];
    // console.log({ image });

    if (image) {
      const data = new FormData();
      data.append("profile-image", image);

      const res = await apiClient.post(UPLOAD_PROFILE_IMAGE, data, {
        withCredentials: true,
      });

      if (res.status === 200 && res.data.image) {
        const newPath = res.data.image.startsWith("http")
          ? res.data.image
          : `${HOST}/${res.data.image}`;
        setUserInfo({ ...userInfo, image: res.data.image });
        setImage(newPath);
        toast.success("Image Updated Successfully.");
      }

      // const reader = new FileReader();
      // reader.onload = () => {
      //   setImage(reader.result);
      // };

      // reader.readAsDataURL(image);
    }
  };

  const handleImageDelete = async (e) => {
    try {
      const res = await apiClient.delete(DELETE_PROFILE_IMAGE, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });

        toast.success("Profile image delete successfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }

    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please set your profile.");
    }
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Saved Successfully!!");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex flex-col justify-center items-center gap-10">
      <div className="flex flex-col justify-center items-center gap-10 ">
        <div className="flex items-start justify-start gap-10 w-[80vw] md:w-max">
          <div className="absolute left-6 top-6" onClick={handleNavigate}>
            <IoArrowBack className="text-4xl lg:text-5xl text-white/90 cursor-pointer" />
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex justify-center items-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                onClick={image ? handleImageDelete : handleFileInput}
              >
                {image ? (
                  <FaTrash className="cursor-pointer text-3xl text-white " />
                ) : (
                  <FaPlus className="cursor-pointer text-3xl text-white " />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileRef}
              onChange={handleImageUpdate}
              className="hidden"
              name="profile-image"
              accept=".jpg, .png, .jpeg,.svg, .webp"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1"
                      : ""
                  } `}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full rounded-xl bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Change
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
