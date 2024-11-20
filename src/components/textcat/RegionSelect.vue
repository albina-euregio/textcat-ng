import { FunctionalComponent } from "preact";
import { Dispatch, StateUpdater, useContext } from "preact/hooks";
import { I18nContext } from "./contexts";

interface Props {
  regions: Set<string>;
  srcRegion: string;
  setSrcRegion: Dispatch<StateUpdater<string>>;
}

const RegionSelect: FunctionalComponent<Props> = (props: Props) => {
  const t = useContext(I18nContext);
  return (
    <label>
      {`[${t("region")}: `}
      <select
        value={props.srcRegion}
        onChange={(e): void =>
          props.setSrcRegion((e.target as HTMLSelectElement).value)
        }
      >
        <option value=""></option>
        {Array.from(props.regions)
          .sort()
          .map(region => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
      </select>
      {"]"}
    </label>
  );
};

export default RegionSelect;
