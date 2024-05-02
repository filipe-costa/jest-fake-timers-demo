import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { waitFor, renderHook, act } from "@testing-library/react";
import {
  DELETE_DOG_MUTATION,
  useDeleteDogMutation,
} from "./use-delete-dog-mutation";
import { ReactNode } from "react";
import { loadDevMessages } from "@apollo/client/dev";
import { useMutation } from "@apollo/client";

loadDevMessages();

beforeAll(() => {
  jest.useFakeTimers();
});

describe("useDeleteDogMutation()", () => {
  it("should delete dog - using custom mutation", async () => {
    const deleteDog = {
      deleteDog: { name: "Buck", breed: "Poodle", id: 1, __typename: "Dog" },
    };
    const mocks = [
      {
        request: {
          query: DELETE_DOG_MUTATION,
          variables: { name: "Buck" },
        },
        result: { data: deleteDog },
      },
    ];

    const { result } = renderHook(
      () => useDeleteDogMutation({ name: "Buck" }),
      { wrapper: getWrapper({ mocks }) },
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(undefined);

    act(() => void result.current.deleteDog());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(undefined);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(deleteDog);
  });

  it("should delete dog - using regular mutation", async () => {
    const deleteDog = {
      deleteDog: { name: "Buck", breed: "Poodle", id: 1, __typename: "Dog" },
    };
    const mocks = [
      {
        request: {
          query: DELETE_DOG_MUTATION,
          variables: { name: "Buck" },
        },
        result: { data: deleteDog },
      },
    ];

    const { result } = renderHook(
      () => useMutation(DELETE_DOG_MUTATION, { variables: { name: "Buck" } }),
      { wrapper: getWrapper({ mocks }) },
    );

    const deleteDogMutation = result.current[0];
    expect(result.current[1].loading).toBe(false);
    expect(result.current[1].data).toBe(undefined);

    act(() => void deleteDogMutation());
    expect(deleteDogMutation).toBe(result.current[0]);
    expect(result.current[1].loading).toBe(true);
    expect(result.current[1].data).toBe(undefined);

    await waitFor(() => {
      expect(result.current[1].loading).toBe(false);
    });

    expect(result.current[1].data).toEqual(deleteDog);
  });

  const getWrapper = ({ mocks }: { mocks: MockedResponse[] }) => {
    return ({ children }: { children: ReactNode }) => (
      <MockedProvider mocks={mocks} addTypename={true}>
        {children}
      </MockedProvider>
    );
  };
});
