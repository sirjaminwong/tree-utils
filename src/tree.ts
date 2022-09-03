type TreeNode<T, NameKey extends keyof T, IdKey extends keyof T> = {
  [key in keyof T]: T[key];
} & {
  children?: TreeNode<T, NameKey, IdKey>[];
} & {
  [key in NameKey]: string;
} & { [key in IdKey]: number | string };

type FlatNode<T, NameKey extends keyof T, IdKey extends keyof T> = {
  path: { name: T[NameKey]; id: T[IdKey] }[];
  parentId: T[IdKey] | null;
  isLeaf: boolean;
} & {
  [key in NameKey]: T[NameKey];
} & { [key in IdKey]: T[IdKey] } & Omit<T, "children" | NameKey | IdKey>;

export function flatTree<
  T extends TreeNode<T, NameKey, IdKey>,
  NameKey extends keyof T,
  IdKey extends keyof T
>(
  node: T,
  mapping: { id: IdKey; name: NameKey },
  parent?: FlatNode<T, NameKey, IdKey>
): Array<FlatNode<T, NameKey, IdKey>> {
  const result: Array<FlatNode<T, NameKey, IdKey>> = [];
  const current: FlatNode<T, NameKey, IdKey> = {
    ...node,
    path: [
      ...(parent?.path || []),
      {
        id: node[mapping.id],
        name: node[mapping.name],
      },
    ],
    isLeaf: !node.children?.length,
    parentId: parent ? parent[mapping.id] : null,
  };

  result.push(current);

  const children = node.children || [];

  for (let index = 0; index < children.length; index += 1) {
    const element = children[index];
    const others = flatTree<T, NameKey, IdKey>(element, mapping, current);
    result.push(...others);
  }

  return result;
}
