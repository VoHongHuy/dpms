/**
 * Generate random ID from char and number
 *
 */
const generateId = () => Math.random().toString(36).substr(2, 9);

export default generateId;
