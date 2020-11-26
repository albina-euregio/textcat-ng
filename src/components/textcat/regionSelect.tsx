import { FunctionalComponent, h } from "preact";
import { StateUpdater } from "preact/hooks";
import { t } from "../../i18n";

interface Props {
  regions: Set<string>;
  srcRegion: string;
  setSrcRegion: StateUpdater<string>;
}

const RegionSelect: FunctionalComponent<Props> = (props: Props) => (
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

export default RegionSelect;
