import { gql, useMutation } from "@apollo/client";

export const DELETE_DOG_MUTATION = gql`
  mutation deleteDog($name: String!) {
    deleteDog(name: $name) {
      id
      name
      breed
    }
  }
`;

type UseDeleteDogMutationProps = {
  name: string;
};

export const useDeleteDogMutation = ({ name }: UseDeleteDogMutationProps) => {
  const [deleteDog, { loading, error, data }] = useMutation(
    DELETE_DOG_MUTATION,
    {
      variables: {
        name,
      },
    },
  );

  return {
    deleteDog,
    loading,
    error,
    data,
  };
};
