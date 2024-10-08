const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if (existingUser) {
    return { error: 'Username is taken' };
  }

  const user = { id, name, room };
  users.push(user);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0]; // Return the removed user
  }

  return null; // Return null if no user was found
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  return user || null; // Return null if no user was found
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room.toLowerCase());
};

export { addUser, removeUser, getUser, getUsersInRoom };
