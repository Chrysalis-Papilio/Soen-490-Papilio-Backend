const requiredMessage = (item: string) => `${item} is required`;

const invalidMessage = (item: string, type: string) => `${item} should be of type ${type}`;

export { requiredMessage, invalidMessage };
