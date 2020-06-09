import * as React from 'react';
import { render } from '@testing-library/react';
import useConsistentValue from '../src';

describe(useConsistentValue, () => {
  test('should not run effect if value is the same', () => {
    interface EffectTesterProps {
      data: { title: string };
      onEffect(): void;
    }

    function EffectTester({ data, onEffect }: EffectTesterProps) {
      const value = useConsistentValue(data);
      React.useEffect(() => onEffect(), [value]);
      return null;
    }

    const onEffect = jest.fn();

    const { rerender } = render(
      <EffectTester data={{ title: 'test-1' }} onEffect={onEffect} />
    );

    expect(onEffect).toHaveBeenCalledTimes(1);

    rerender(<EffectTester data={{ title: 'test-1' }} onEffect={onEffect} />);

    expect(onEffect).toHaveBeenCalledTimes(1);

    rerender(<EffectTester data={{ title: 'test-2' }} onEffect={onEffect} />);

    expect(onEffect).toHaveBeenCalledTimes(2);
  });

  test('should not run memo if value is the same', () => {
    interface MemoTesterProps {
      data: { title: string };
    }

    let number = 0;
    function MemoTester({ data }: MemoTesterProps) {
      const value = useConsistentValue(data);
      const updated = React.useMemo(() => {
        return { ...data, updated: number++ };
      }, [value]);
      return <>{updated.title}</>;
    }

    const { rerender } = render(<MemoTester data={{ title: 'test-1' }} />);

    expect(number).toBe(1);

    rerender(<MemoTester data={{ title: 'test-1' }} />);

    expect(number).toBe(1);

    rerender(<MemoTester data={{ title: 'test-2' }} />);

    expect(number).toBe(2);
  });

  test('should support custom compare', () => {
    interface Data {
      title: string;
      [key: string]: any;
    }

    interface EffectTesterProps {
      data: Data;
      onEffect(): void;
    }

    const compare = jest.fn((a: Data, b: Data) => a.title === b.title);

    function EffectTester({ data, onEffect }: EffectTesterProps) {
      const value = useConsistentValue(data, compare);
      React.useEffect(() => onEffect(), [value]);
      return null;
    }

    const onEffect = jest.fn();

    const { rerender } = render(
      <EffectTester
        data={{ title: 'test-1', another: true }}
        onEffect={onEffect}
      />
    );

    expect(onEffect).toHaveBeenCalledTimes(1);
    expect(compare).toHaveBeenCalledTimes(1);

    rerender(
      <EffectTester
        data={{ title: 'test-1', another: false }}
        onEffect={onEffect}
      />
    );

    expect(onEffect).toHaveBeenCalledTimes(1);
    expect(compare).toHaveBeenCalledTimes(2);

    rerender(
      <EffectTester
        data={{ title: 'test-2', another: false }}
        onEffect={onEffect}
      />
    );

    expect(onEffect).toHaveBeenCalledTimes(2);
    expect(compare).toHaveBeenCalledTimes(3);
  });
});
