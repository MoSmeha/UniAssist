import LostAndFoundItem from "../models/lostitem.model.js";
import * as notificationService from "./notification.service.js";

export const createLostAndFoundItem = async (itemData, userId, imagePath) => {
  const { title, description, category, location, phoneNumber, type } = itemData;

  if (
    !title?.trim() ||
    !description?.trim() ||
    !category ||
    !location?.trim() ||
    !phoneNumber?.trim() ||
    !type
  ) {
    throw new Error("All required fields must be provided.");
  }

  if (!["lost", "found"].includes(type)) {
    throw new Error("Type must be either 'lost' or 'found'.");
  }

  const newItem = new LostAndFoundItem({
    title: title.trim(),
    description: description.trim(),
    category,
    location: location.trim(),
    phoneNumber: phoneNumber.trim(),
    image: imagePath || "",
    type,
    postedBy: userId,
  });

  const savedItem = await newItem.save();
  await savedItem.populate("postedBy", "firstName lastName profilePic");
  return savedItem;
};

export const getLostAndFoundItems = async (query) => {
  const filter = {};
  if (query.type && ["lost", "found"].includes(query.type)) {
    filter.type = query.type;
  }
  if (query.category) {
    filter.category = query.category;
  }
  if (query.resolved === "true" || query.resolved === "false") {
    filter.resolved = query.resolved === "true";
  }

  const page = parseInt(query.page, 10) >= 1 ? parseInt(query.page, 10) : 1;
  const limit = parseInt(query.limit, 10) >= 1 ? parseInt(query.limit, 10) : 10;

  const items = await LostAndFoundItem.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("postedBy", "firstName lastName profilePic");

  const totalCount = await LostAndFoundItem.countDocuments(filter);

  return {
    items,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    },
  };
};

export const getLostAndFoundItemById = async (itemId) => {
  const item = await LostAndFoundItem.findById(itemId).populate(
    "postedBy",
    "firstName lastName profilePic"
  );

  if (!item) {
    throw new Error("Item not found");
  }
  return item;
};

export const updateResolvedStatus = async (itemId, resolved, userId) => {
  if (typeof resolved !== "boolean") {
    throw new Error("Resolved must be a boolean value.");
  }

  const item = await LostAndFoundItem.findById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }

  if (item.postedBy.toString() !== userId.toString()) {
    throw new Error("You are not authorized to update this item.");
  }

  item.resolved = resolved;
  await item.save();
  await item.populate("postedBy", "firstName lastName profilePic");
  return item;
};

export const deleteLostAndFoundItem = async (itemId, userId) => {
  const item = await LostAndFoundItem.findById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }

  if (item.postedBy.toString() !== userId.toString()) {
    throw new Error("You are not authorized to delete this item.");
  }

  await LostAndFoundItem.deleteOne({ _id: itemId });
  return true;
};

export const sendNotificationToPoster = async (itemId, senderId, message) => {
  const item = await LostAndFoundItem.findById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }

  const recipientId = item.postedBy.toString();

  await notificationService.notifyUsers({
    recipients: [recipientId],
    sender: senderId,
    type: "lostfound",
    message: message || "This is my item",
    data: { itemId: item._id, type: "Lost & Found" },
  });

  return true;
};
