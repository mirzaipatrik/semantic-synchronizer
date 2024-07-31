import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SupportedTypes = string | number | string[];

type ValueType<T extends SupportedTypes> = T extends number ? number : T extends string[] ? string[] : T extends string ? string : never;

type UseQuerySearchParamOptions<T extends SupportedTypes> = {
    name: string;
    defaultValue: T;
    replace?: boolean;
};

type SetQuerySearchParamAction<T extends SupportedTypes> = (value: T | ((prev: T) => T), replaceHistoryState?: boolean) => void;

type UseSearchQueryParamReturnType<T extends SupportedTypes> = [ValueType<T>, SetQuerySearchParamAction<ValueType<T>>];

/**
 * A hook that returns the value of a query parameter in the URL.
 * Supports both string and number types, and does automatic type conversion.
 * @returns Returns the value of the query parameter and a function to set a new value.
 */
export function useQuerySearchParam<T extends SupportedTypes>({ name, defaultValue, replace = false }: UseQuerySearchParamOptions<T>): UseSearchQueryParamReturnType<T>{
    const ignoreState = useRef(false);
    const firstRender = useRef(true);
    const temporaryReplaceState = useRef(false);
    const type = useMemo(() => Array.isArray(defaultValue) ? "array" : typeof defaultValue as "string" | "number", [defaultValue]);

    const [value, initialSetValue] = useState<ValueType<T>>(() => {
        if (typeof window === "undefined") return defaultValue as unknown as ValueType<T>;

        // Updating the value from the query search on mount.
        const query = new URLSearchParams(window.location.search);
        const queryValue = query.get(name);
        if (queryValue) {
            if (type === "number") {
                return Number(queryValue) as ValueType<T>;
            } else if (type === "array") {
                return queryValue.split(",") as ValueType<T>;
            }
            return queryValue as ValueType<T>;
        }
        return defaultValue as unknown as ValueType<T>;
    });

    const setValue = useCallback<SetQuerySearchParamAction<ValueType<T>>>((value, replaceHistoryState = false) => {
        if (replaceHistoryState) {
            temporaryReplaceState.current = true;
        }
        initialSetValue(value);
    }, [name]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (ignoreState.current) {
            ignoreState.current = false;
            return;
        }

        // Updating the query search when the value changes.
        const query = new URLSearchParams(window.location.search);
        query.set(name, `${type === "array" ? (value as string[]).join(",") : value as string | number}`);
        if (firstRender.current) {
            firstRender.current = false;
            window.history.replaceState(null, "", `?${query.toString()}`);
            return;
        }
        window.history[replace || temporaryReplaceState.current ? "replaceState" : "pushState"](null, "", `?${query.toString()}`);
        temporaryReplaceState.current = false;
    }, [value, type]);

    useEffect(() => {
        if (!replace) {
            const onPopstate = () => {
                const query = new URLSearchParams(window.location.search);
                ignoreState.current = true;
                const queryValue = query.get(name);
                const newValue = (queryValue
                    ? (type === "number"
                        ? Number(queryValue)
                        : type === "array"
                            ? queryValue.split(",")
                            : queryValue)
                    : defaultValue) as ValueType<T>;
                setValue(newValue);
            };
            window.addEventListener("popstate", onPopstate);

            return () => {
                window.removeEventListener("popstate", onPopstate);
            };
        }
    }, [name, defaultValue, type, replace, setValue]);

    return [value, setValue];
}