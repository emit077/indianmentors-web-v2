import feather from 'feather-icons';

const getFeatherIcon = (icon_name) => {
  return feather.toSvg(icon_name);
};

export default getFeatherIcon;
