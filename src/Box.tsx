import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { type BoxProps } from './types';

interface BoxPropsExtended extends BoxProps {
  active: boolean;
}

function getStyles(
  props: BoxPropsExtended,
  isDragging: boolean
): React.CSSProperties {
  return {
    height: props.height,
    width: props.width,
    backgroundColor: props.color,
    position: 'absolute',
    top: props.y,
    left: props.x,
    opacity: isDragging ? 0 : props.active ? 0.5 : 1
  };
}

const Box: React.FC<BoxPropsExtended> = (props) => {
  const [{ isDragging }, ref, preview] = useDrag(
    () => ({
      type: 'box',
      item: props,
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging()
        };
      }
    }),
    [props]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return <div ref={ref} style={getStyles(props, isDragging)} />;
};

export default Box;
