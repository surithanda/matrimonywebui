import { useAppSelector } from "@/app/store/store";

type componentProps = {
    type:string,
    bindValue?:any, 
    changeHandler?:any,
    custSelectValue?:boolean
}


  const genderRefArr = [
    {name: 'Male', value: 1},
    {name: 'Female', value: 2},
    {name: 'Other', value: 3}
  ]

  const getgenderVal = (name) => {
    let match;
    genderRefArr.map((item) => {
      if(item.name.toLowerCase() === name.toLowerCase()) match = item;
    })
    return match;
  }


const MetadataSelectComponent = ({
    type,
    bindValue,
    changeHandler,
    custSelectValue = false
}: componentProps) => {
    const metaData = useAppSelector((state) => state.metaData);
    const listName = `${type}List`;
    const optionsList = metaData[listName];


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
        >
            <option value="">Select {type.charAt(0).toUpperCase() + type.slice(1)}</option>
            {optionsList && optionsList.map((item: any) => (
                <option key={item.id} value={custSelectValue && customValFunc ? customValFunc(item.name).value : item.name}>
                    {item.name}
                </option>
            ))}
        </select>
    );
}

export default MetadataSelectComponent;