import axios from "axios";
import { HOST } from "@/util/constants.js";

export const apiClient = axios.create({
  baseURL: HOST,
});
