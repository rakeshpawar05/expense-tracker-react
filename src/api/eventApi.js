import axiosInstance from "./Axios";

export const createEvent = async (event) =>
  await axiosInstance.post("/events", event);

export const getEvents = async (userId) =>
  await axiosInstance.get("/events", { params: { userId } });

export const deleteEvent = async (id) =>
  await axiosInstance.delete(`/events/${id}`);
