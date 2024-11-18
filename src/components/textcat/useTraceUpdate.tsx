import { useRef, useEffect } from "preact/hooks";

export function useTraceUpdate(props: Record<string, unknown>) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props)
      .filter(([k, v]) => prev.current[k] !== v)
      .map(([k, v]) => [k, prev.current[k], v]);
    if (changedProps.length > 0) {
      console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
}
