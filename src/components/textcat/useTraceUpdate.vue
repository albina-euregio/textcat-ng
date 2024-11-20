import { useRef, useEffect } from "preact/hooks";

export function useTraceUpdate(label: string, props: Record<string, unknown>) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props)
      .filter(([k, v]) => prev.current[k] !== v)
      .flatMap(([k, v]) => [k, prev.current[k], v]);
    if (changedProps.length > 0) {
      console.log("Changed props:", label, ...changedProps);
    }
    prev.current = props;
  });
}
