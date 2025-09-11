import { useAppSelector } from "@/app/store/store";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type componentProps = {
  type: string;
  bindValue?: any;
  bindValue2?: any;
  changeHandler?: any;
  callingCodeBinding?: any;
};

const CustomPhoneComponent = (
  props: componentProps &
    React.InputHTMLAttributes<HTMLInputElement> &
    React.SelectHTMLAttributes<HTMLSelectElement>
) => {
  const {
    type,
    bindValue,
    bindValue2,
    changeHandler,
    callingCodeBinding,
    ...rest
  } = props;
  const { countryList } = useAppSelector((state) => state.metaData);

  return (
    <div className="flex w-full gap-2">
      <Select
        value={bindValue2 || undefined} // ✅ force undefined when empty
        onValueChange={(value) =>
          changeHandler({ target: { name: `${type}_country`, value } })
        }
        {...callingCodeBinding}
      >
        <SelectTrigger className="bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.01)_100%)] px-2 w-24 focus:outline-none focus:ring-2 focus:ring-orange-500 py-3 border rounded-lg">
          <SelectValue placeholder="Country Code" />
        </SelectTrigger>

        <SelectContent>
          {countryList &&
            countryList.map((country: any) => (
              <SelectItem
                key={country.country_id}
                value={country.country_code_2}
              >
                {country.flag_emoji} {country.country_calling_code}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Input
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
};

export default CustomPhoneComponent;
