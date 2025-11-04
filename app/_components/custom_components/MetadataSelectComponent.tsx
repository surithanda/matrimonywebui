// Utility function to format a string to Capital Case
function toCapitalCase(str: string): string {
  return str
    .replace(/[-_\s]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
import { useAppSelector } from "@/app/store/store";

type componentProps = {
  type: string;
  bindValue?: any;
  changeHandler?: any;
  custSelectValue?: boolean;
  hasAny?: boolean;
  dontUseID?: boolean;
};

const MetadataSelectComponent = (
  props: componentProps & React.SelectHTMLAttributes<HTMLSelectElement>
) => {
  const {
    type,
    bindValue,
    changeHandler,
    custSelectValue = false,
    hasAny,
    dontUseID = false,
    ...rest
  } = props;
  const metaData = useAppSelector((state) => state.metaData);
  const listName = `${type.replace(" ", "")}List`;
  const optionsList = (metaData as any)[listName];

  // console.log(optionsList, listName)

  let customValFunc;
  try {
    customValFunc = eval(
      `typeof get${type}Val !== 'undefined' ? get${type}Val : undefined`
    );
  } catch {
    customValFunc = undefined;
  }

  return (
    <select
      name={type}
      value={bindValue ?? ""}
      onChange={changeHandler}
      className="text-sm bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)] px-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 flex gap-10 align-self-stretch py-3 border rounded-lg"
      // className="flex gap-10 align-self-stretch px-4 py-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)]"
      {...rest}
    >
      <option value={hasAny ? -1 : ""}>
        Select {hasAny ? "Any" : toCapitalCase(type)}
      </option>
      {optionsList &&
        optionsList.map((item: any, index: number) => (
          <option
            key={item.id ?? item.value ?? index}
            value={
              custSelectValue && customValFunc
                ? customValFunc(item.name).value
                : dontUseID
                ? item.name
                : item.id ?? item.value
            }
          >
            {item.name}
          </option>
        ))}
    </select>
  );
};

export default MetadataSelectComponent;
