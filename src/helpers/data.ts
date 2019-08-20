import nanoid from 'nanoid';

export const generateTimeId = (idSize: number = 16): string => {
	return Date.now() + '-' + nanoid(idSize);
};
