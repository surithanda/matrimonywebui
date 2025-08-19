
// Utility function to format a string to Capital Case
function toCapitalCase(str: string): string {
  return str
    .replace(/[-_\s]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}
import { useAppSelector } from "@/app/store/store";

type componentProps = {
    type:string,
    bindValue?:any, 
    changeHandler?:any,
    custSelectValue?:boolean,
    dontUseID?:boolean
}


  const genderRefArr = [
    {name: 'Male', value: 1},
    {name: 'Female', value: 2},
    {name: 'Other', value: 3}
  ]

  const getgenderVal = (name: string) => {
    let match;
    genderRefArr.map((item) => {
      if(item.name.toLowerCase() === name.toLowerCase()) match = item;
    })
    return match;
  }


const MetadataSelectComponent = (props: componentProps & React.SelectHTMLAttributes<HTMLSelectElement>) => {
    const { type, bindValue, changeHandler, custSelectValue = false,  dontUseID = false, ...rest } = props;
    const metaData = useAppSelector((state) => state.metaData);
    const listName = `${type.replace(' ', '')}List`;
    const optionsList = (metaData as any)[listName];

    console.log(optionsList, listName)

    let customValFunc;
    try {
        customValFunc = eval(`typeof get${type}Val !== 'undefined' ? get${type}Val : undefined`);
    } catch {
        customValFunc = undefined;
    }

    return (
        <select
            name={type}
            value={bindValue}
            onChange={changeHandler}
            className="account-input-field w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            {...rest}
        >
            <option value="">Select {toCapitalCase(type)}</option>
            {optionsList && optionsList.map((item: any) => (
                <option key={item.id} value={custSelectValue && customValFunc ? customValFunc(item.name).value : (dontUseID ? item.name : item.id)}>
                    {item.name}
                </option>
            ))}
        </select>
    );
}

export default MetadataSelectComponent;