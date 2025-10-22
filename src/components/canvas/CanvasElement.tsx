import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { CanvasElement as CanvasElementType } from '@/store/canvasStore';
import { cn } from '@/lib/utils';
type CanvasElementProps = CanvasElementType & {
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<CanvasElementType, 'id' | 'type'>>) => void;
  onCommit: () => void;
};
export function CanvasElement(props: CanvasElementProps) {
  const { id, type, x, y, width, height, color, textContent, isSelected, onSelect, onUpdate, onCommit, rotation, opacity, border, imageSrc, fontFamily, fontSize, fontWeight } = props;
  const ref = useRef<HTMLDivElement>(null);
  const bind = useDrag(
    ({ down, movement: [mx, my] }) => {
      onUpdate(id, { x: x + mx, y: y + my });
      if (!down) {
        onCommit();
      }
    },
    { from: () => [x, y], target: ref }
  );
  const handleResize: ResizableBoxProps['onResize'] = useCallback((_event, { size }) => {
    if (typeof onUpdate === 'function') {
      onUpdate(id, { width: size.width, height: size.height });
    }
  }, [id, onUpdate]);
  const handleResizeStop = useCallback(() => {
    onCommit();
  }, [onCommit]);
  const renderElement = () => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      border: border || 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    };
    switch (type) {
      case 'rectangle':
        return <div style={{ ...baseStyle, backgroundColor: color }} />;
      case 'circle':
        return <div style={{ ...baseStyle, backgroundColor: color, borderRadius: '50%' }} />;
      case 'text':
        return <div style={{ ...baseStyle, color: color, fontFamily, fontSize: `${fontSize}px`, fontWeight: fontWeight as React.CSSProperties['fontWeight'] }}>{textContent}</div>;
      case 'image':
        return <img src={imageSrc} alt="canvas element" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
      case 'triangle':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={baseStyle}>
            <polygon points="50,0 100,100 0,100" fill={color} />
          </svg>
        );
      case 'star':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={baseStyle}>
            <polygon points="50,0 61.8,38.2 100,38.2 69.1,61.8 80.9,100 50,76.4 19.1,100 30.9,61.8 0,38.2 38.2,38.2" fill={color} />
          </svg>
        );
      default:
        return null;
    }
  };
  return (
    <motion.div
      ref={ref}
      {...bind()}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        cursor: 'move',
        rotate: rotation || 0,
        opacity: opacity === undefined ? 1 : opacity,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      className={cn(
        "select-none transition-all duration-100",
        isSelected && "outline outline-2 outline-blue-500 outline-offset-2 shadow-lg"
      )}
    >
      <ResizableBox
        width={width}
        height={height}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        minConstraints={[20, 20]}
        maxConstraints={[1000, 1000]}
        handle={(h, handleRef) => (
          <span
            className={`react-resizable-handle react-resizable-handle-${h}`}
            ref={handleRef}
            style={{
              opacity: isSelected ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
            }}
          />
        )}
      >
        {renderElement()}
      </ResizableBox>
    </motion.div>
  );
}