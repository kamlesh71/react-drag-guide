import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { type BoxProps } from './types';

function getStyles(props: BoxProps, isDragging: boolean): React.CSSProperties {
  return {
    height: props.height,
    width: props.width,
    backgroundColor: props.color,
    position: 'absolute',
    top: props.y,
    left: props.x,
    opacity: isDragging ? 0 : 1
  };
}

const Box: React.FC<BoxProps> = (props) => {
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
