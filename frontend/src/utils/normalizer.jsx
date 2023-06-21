import { normalize, schema } from 'normalizr';

const Normalizer = (data) => {
  const message = new schema.Entity('messages');
  const channel = new schema.Entity('channels', {
    messages: [message],
  });
  return normalize(data, [channel]);
};

export default Normalizer;
