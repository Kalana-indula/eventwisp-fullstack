import axios from "axios";

export const api = axios.create({
    baseURL: "/api", // goes through Next.js rewrite to :8080
});