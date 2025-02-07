import type { Building } from "../../../shared/definitions/BuildingDefinitions";
import { Config } from "../../../shared/logic/Config";
import { getSpecialBuildings, getXyBuildings } from "../../../shared/logic/IntraTickCache";
import type { PartialSet } from "../../../shared/utilities/TypeDefinitions";
import { L, t } from "../../../shared/utilities/i18n";
import { useGameState } from "../Global";
import { jsxMapOf } from "../utilities/Helper";
import { Singleton } from "../utilities/Singleton";
import { MenuComponent } from "./MenuComponent";
import { TilePage } from "./TilePage";

export function WonderPage(): React.ReactNode {
   const gs = useGameState();
   const builtWonders: PartialSet<Building> = {};
   getXyBuildings(gs).forEach((building) => {
      if (Config.Building[building.type].max === 1 && Config.Building[building.type].construction) {
         builtWonders[building.type] = true;
      }
   });
   return (
      <div className="window">
         <div className="title-bar">
            <div className="title-bar-text">{t(L.Wonder)}</div>
         </div>
         <MenuComponent />
         <div className="window-body" style={{ display: "flex", flexDirection: "column" }}>
            <div className="mb10">
               <button
                  className="w100 row jcc"
                  onClick={() =>
                     Singleton().routeTo(TilePage, { xy: getSpecialBuildings(gs).Headquarter.tile })
                  }
               >
                  <div className="m-icon" style={{ margin: "0 5px 0 -5px", fontSize: "18px" }}>
                     arrow_back
                  </div>
                  <div className="f1">{t(L.GoBack)}</div>
               </button>
            </div>
            <div className="table-view sticky-header f1">
               <table>
                  <thead>
                     <tr>
                        <th></th>
                        <th>{t(L.GreatPeopleName)}</th>
                        <th>{t(L.GreatPeopleEffect)}</th>
                     </tr>
                  </thead>
                  <tbody>
                     {jsxMapOf(Config.Building, (b, def) => {
                        if (def.max !== 1 || !def.construction) {
                           return null;
                        }
                        return (
                           <tr key={b}>
                              <td>
                                 {builtWonders[b] ? (
                                    <div className="m-icon small text-green">check_circle</div>
                                 ) : null}
                              </td>
                              <td>{def.name()}</td>
                              <td>{def.desc?.()}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
