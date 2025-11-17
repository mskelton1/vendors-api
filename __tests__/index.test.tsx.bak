import * as React from "react";
import userEvent from "@testing-library/user-event";
import { act, render, screen } from "@testing-library/react";

import VendorApi from "../src";
import type { PromiseOr, FieldOption, OnChangeCallback } from "../src";
import { getVendorsApi, hasVendorsApi } from "../src/internal";

const fieldId = "customfield_100023";

const TestCustomField = () => {
  // Ref typed to your API's OnChangeCallback
  const onChangeRef = React.useRef<OnChangeCallback<string>>();
  // Ref initialized with null
  const fieldRef = React.useRef<HTMLInputElement | null>(null);
  // State explicitly typed
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
  test("hasVendorsApi", () => {
    render(<TestCustomField />);
    expect(hasVendorsApi(fieldId)).toEqual(true);
  });

  test("setValue", () => {
    render(<TestCustomField />);
    getVendorsApi(fieldId)?.setValue("hello world");
    expect(screen.getByRole<HTMLInputElement>("textbox").value).toEqual(
      "hello world"
    );
  });

  test("getValue", async () => {
    render(<TestCustomField />);
    await userEvent.type(screen.getByRole("textbox"), "ola!");
    expect(getVendorsApi(fieldId)?.getValue()).toEqual("ola!");
  });

  test("setReadOnly", () => {
    render(<TestCustomField />);
    expect(screen.getByRole<HTMLInputElement>("textbox").readOnly).toEqual(false);

    getVendorsApi(fieldId)?.setReadOnly(true);
    expect(screen.getByRole<HTMLInputElement>("textbox").readOnly).toEqual(true);

    getVendorsApi(fieldId)?.setReadOnly(false);
    expect(screen.getByRole<HTMLInputElement>("textbox").readOnly).toEqual(false);
  });

  test("bindOnChange", async () => {
    const callback = jest.fn();
    render(<TestCustomField />);
    getVendorsApi(fieldId)?.bindOnChange(callback);
    await userEvent.type(screen.getByRole("textbox"), "fire in the hole!");
    expect(callback).toHaveBeenCalled();
  });

  test("setOptions", () => {
    render(<TestCustomField />);
    act(() =>
      getVendorsApi(fieldId)?.setOptions([
        { key: "1", value: "one" },
        { key: "2", value: "two" },
      ])
    );
    expect(screen.getByText("one")).toBeVisible();
    expect(screen.getByText("two")).toBeVisible();
  });
});
