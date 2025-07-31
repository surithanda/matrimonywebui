import { useAppSelector } from "@/app/store/store";

type componentProps = {
    type:string,
    bindValue?:any, 
    bindValue2?:any, 
    changeHandler?:any,
    callingCodeBinding?:any
}

const CustomPhoneComponent = (props: componentProps & React.InputHTMLAttributes<HTMLInputElement> & React.SelectHTMLAttributes<HTMLSelectElement>) => {
    const { type, bindValue, bindValue2, changeHandler, callingCodeBinding, ...rest } = props;
    const {countryList} = useAppSelector((state) => state.metaData);

    return (
        <div className="flex w-full gap-2">
            <select
                name={`${type}_country`}
                value={bindValue2}
                onChange={changeHandler}
                className="account-input-field w-33 focus:outline-none focus:ring-2 focus:ring-orange-500"
                {...callingCodeBinding}
                >
                <option value="">Country Code</option>
                {countryList && countryList?.map((country: any) => (
                    <option key={country.country_id} value={country.country_code_2}>
                    {country.flag_emoji} {country.country_calling_code}
                    </option>
                ))}
            </select>
            <input
                type="text"
                name={type}
                value={bindValue}
                onChange={changeHandler}
                maxLength={11}
                className="w-full account-input-field focus:outline-none focus:ring-2 focus:ring-orange-500"
                {...rest}
            />
        </div>
    );
}

export default CustomPhoneComponent;