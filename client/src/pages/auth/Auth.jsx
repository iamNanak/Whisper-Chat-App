import React, { useState } from "react";
import bg from "@/assets/login2.png";
import victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "@/util/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/store.js";

function Auth() {
  const navigate = useNavigate();

  const { setUserInfo } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  console.log(useAppStore.getState());
  const validateSignup = () => {
    if (email.trim() == "") {
      toast.error("Email is required.");
      return false;
    }
    if (password.trim() == "") {
      toast.error("Password is required.");
      return false;
    }
    if (confirmPassword !== password && confirmPassword.trim() != "") {
      toast.error("Enter correct credentials.");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (email.trim() == "") {
      toast.error("Email is required.");
      return false;
    }
    if (password.trim() == "") {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    // console.log(validateLogin());
    if (validateLogin()) {
      const response = await apiClient.post(
        LOGIN_ROUTES,
        { email, password },
        { withCredentials: true }
      );

      // console.log(response);
      if (response.data.user.id) {
        // console.log(response.data.user.id);
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
      // console.log({ response });
    }
  };

  const handleSignUp = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTES,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserInfo(response.data.user);
        navigate("/profile");
      }
      console.log({ response });
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex justify-center items-center flex-col">
            <div className="flex justify-center items-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={victory} alt="victory emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex justify-center items-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 overflow-hidden"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                <Input
                  type="email"
                  placeholder="Enter your Email"
                  className="rounded-full p-6 mx-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Enter Your Password"
                  className="rounded-full p-6 mx-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={handleLogin}
                  className="w-full rounded-full p-6 mx-4"
                >
                  Login
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="flex flex-col gap-5">
                <Input
                  type="email"
                  placeholder="Enter your Email"
                  className="rounded-full p-6 mx-4"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Enter Your Password"
                  className="rounded-full p-6 mx-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="rounded-full p-6 mx-4"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  onClick={handleSignUp}
                  className="w-full p-6 mx-4 rounded-full"
                >
                  SignUp
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={bg} alt="background images" className="h-[500px]" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
