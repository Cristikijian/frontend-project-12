import { normalize, schema } from 'normalizr';

const Normalizer = (data) => {
    const channel = new schema.Entity('channels');
    return normalize(data, [channel]);
  };


export default Normalizer;
