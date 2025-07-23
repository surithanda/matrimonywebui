import { useAppSelector } from "@/app/store/store";

type componentProps = {
    type:string,
    bindValue?:any, 
    bindValue2?:any, 
    changeHandler?:any
}

const CustomPhoneComponent = ({
    type,
    bindValue, //phone no
    bindValue2, //calling code
    changeHandler,
}: componentProps) => {
    const {countryList} = useAppSelector((state) => state.metaData);

    return (
        <div className="flex w-full gap-2">
            <select
                name={`${type}_country`}
                value={bindValue2 || "+91"}
                onChange={changeHandler}
                className="account-input-field w-35 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                <option value="">Select Country Code</option>
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
            />
        </div>
    );
}

export default CustomPhoneComponent;