export const guid = () => {
  return 'xxxxxxxx'.replace(/[x]/g, (c) => {
    let r = (Math.random() * 16) | 0;
    let v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const kebabcase = (v) => v.replace(/([A-Z])/g, '-$1').toLowerCase();
