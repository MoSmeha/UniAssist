import CafeteriaMenu from "../models/CafeteriaMenu.model.js";

export const getMenuByDay = async (day) => {
  const menu = await CafeteriaMenu.findOne({ day });
  if (!menu) throw new Error("Menu not found");
  return menu;
};

export const createMenuForDay = async (menuData) => {
  const { day, breakfast = [], lunch = [], dessert = [] } = menuData;
  const exists = await CafeteriaMenu.findOne({ day });
  if (exists) throw new Error("Menu already exists");

  return await CafeteriaMenu.create({ day, breakfast, lunch, dessert });
};

export const addMenuItem = async (day, category, item) => {
  const menu = await CafeteriaMenu.findOne({ day });
  if (!menu) throw new Error("Menu not found");

  if (!["breakfast", "lunch", "dessert"].includes(category)) {
    throw new Error("Invalid category");
  }

  menu[category].push(item);
  await menu.save();
  return menu;
};

export const updateMenuItem = async (day, category, itemId, updateData) => {
  const { name, protein, calories, image } = updateData;
  const menu = await CafeteriaMenu.findOne({ day });
  if (!menu) throw new Error("Menu not found");

  const item = menu[category].id(itemId);
  if (!item) throw new Error("Item not found");

  if (name !== undefined) item.name = name;

  if (protein !== undefined) {
    if (typeof protein !== 'number' || isNaN(protein)) {
      throw new Error("Protein must be a number");
    }
    item.protein = protein;
  }

  if (calories !== undefined) {
    if (typeof calories !== 'number' || isNaN(calories)) {
      throw new Error("Calories must be a number");
    }
    item.calories = calories;
  }

  if (image !== undefined) item.image = image;

  await menu.save();
  return menu;
};

export const deleteMenuItem = async (day, category, itemId) => {
  const menu = await CafeteriaMenu.findOne({ day });
  if (!menu) throw new Error("Menu not found");

  const itemIndex = menu[category].findIndex((i) => i._id.toString() === itemId);
  if (itemIndex === -1) throw new Error("Item not found");

  menu[category].splice(itemIndex, 1);
  await menu.save();
  return menu;
};
