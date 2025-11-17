import * as React from "react";
import userEvent from "@testing-library/user-event";
import { act, render, screen, waitFor } from "@testing-library/react";

import VendorApi from "../src";
import type { PromiseOr, FieldOption, OnChangeCallback } from "../src";
import { getVendorsApi, hasVendorsApi } from "../src/internal";

const fieldId = "customfield_100023";

const TestCustomField = () => {
  const onChangeRef = React.useRef<OnChangeCallback<string>>();
  const fieldRef = React.useRef<HTMLInputElement | null>(null);
  const [options, setOptions] = React.useState<FieldOption[]>([]);

  React.useEffect(() => {
    VendorApi.init<string>(fieldId, {
      setValue: (value: string): PromiseOr<void> => {
        if (fieldRef.current) {
          fieldRef.current.value = value;
        }
      },
      getValue: (): PromiseOr<string> => fieldRef.current?.value ?? "",
      setReadOnly: (readOnly: boolean): PromiseOr<void> => {
        if (fieldRef.current) {
          fieldRef.current.readOnly = readOnly;
        }
      },
      bindOnChange: (callback: OnChangeCallback<string>): PromiseOr<void> => {
        onChangeRef.current = callback;
      },
      setOptions: (opts: FieldOption[]): PromiseOr<void> => setOptions(opts),
    });
  }, []);

  return (
    <div>
      <label htmlFor={fieldId}>My Custom Field</label>
      <input
        id={fieldId}
        ref={fieldRef}
        onChange={(e) =>
          onChangeRef.current?.({
            fieldId,
            value: e.currentTarget.value,
          })
        }
      />
      {options.map(({ key, value }) => (
        <p key={key}>{value}</p>
      ))}
    </div>
  );
};

describe("Vendors API", () => {
  test("hasVendorsApi", async () => {
    render(<TestCustomField />);
    await waitFor(() => expect(hasVendorsApi(fieldId)).toBe(true));
  });

  test("setValue", async () => {
    render(<TestCustomField />);
    await waitFor(() => expect(hasVendorsApi(fieldId)).toBe(true));

    const api = getVendorsApi(fieldId)!;
    api.setValue!("hello world");

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toEqual(
      "hello world"
    );
  });

  test("getValue", async () => {
    render(<TestCustomField />);
    await waitFor(() => expect(hasVendorsApi(fieldId)).toBe(true));

    await userEvent.type(screen.getByRole("textbox"), "ola!");
    const api = getVendorsApi(fieldId)!;

    expect(api.getValue!()).toEqual("ola!");
  });

  test("setReadOnly", async () => {
    render(<TestCustomField />);
    await waitFor(() => expect(hasVendorsApi(fieldId)).toBe(true));

    expect(screen.getByRole<HTMLInputElement>("textbox").readOnly).toEqual(false);

    const api = getVendorsApi(fieldId)!;
    api.setReadOnly!(true);
    expect(screen.getByRole<HTMLInputElement>("textbox").readOnly).toEqual(true);

    api.setReadOnly!(false);
    expect(screen.getByRole<HTMLInputElement>("textbox").readOnly).toEqual(false);
  });

  test("bindOnChange", async () => {
    const callback = jest.fn();
    render(<TestCustomField />);
    await waitFor(() => expect(hasVendorsApi(fieldId)).toBe(true));

    const api = getVendorsApi(fieldId)!;
    api.bindOnChange!(callback);

    await userEvent.type(screen.getByRole("textbox"), "fire in the hole!");
    expect(callback).toHaveBeenCalled();
  });

  test("setOptions", async () => {
    render(<TestCustomField />);
    await waitFor(() => expect(hasVendorsApi(fieldId)).toBe(true));

    const api = getVendorsApi(fieldId)!;

    act(() =>
      api.setOptions!([
        { key: "1", value: "one" },
        { key: "2", value: "two" },
      ])
    );

    expect(screen.getByText("one")).toBeVisible();
    expect(screen.getByText("two")).toBeVisible();
  });
});