import type { NatalChartDisplayOptions } from './natalChartOptions'

/** สคริปต์ใน iframe — สลับเรือน / มาตรฐาน (ใช้ logic เดียวกับ myhora do_thou / do_tstd) */
export function natalChartOverlayScript(opts: NatalChartDisplayOptions): string {
  const json = JSON.stringify(opts)
  return `<script>
(function(){
  var O = ${json};
  var HOUSE_IDS = {
    lux: 'cn_hou',
    tanuluk: 'cn_hou_tanuluk',
    tanuset: 'cn_hou_tanuset',
    tanukaset: 'cn_hou_tanukaset'
  };
  var FORMATS = {
    A: ["๓","๖","๔","๒","๑","๔","๖","๓","๕","๗","๘","๕"],
    B: ["๓","๖","๔","๒","๑","๔","๖","๓","๕","๗","๗","๕"],
    C: ["พ","๘","๙","๒","๑","๔","๖","๓","๕","๗","๐","น"],
    D: ["พ","บ","๘,๙","๒","๑","๔","๖","๓","๕","๗","๐","น"],
    E: ["๓","๖","๔","๒","๑","๔","๖","๓","๕","๗","๗","๕"],
    F: ["๓","๖","๔","๒","๑","๔","๖","๓,พ","๕","๗","๗,๐","๕,น"],
    G: ["๓,พ","๖","๔","๒","๑","๔","๖","๓","๕","๗","๗,๐","๕,น"],
    aut: ["๑","๒"," ","๕"," ","๔","๗","๘"," ","๓"," ","๖"],
    aut_plu: ["๑","๒","๐","๕","๘,๙","๔","๗","น","พ","๓","บ","๖"],
    pra8: ["๖","๓","๕","๗","๘","๕","๓","๖","๔","๒","๑","๔"],
    pra7: ["๖","๓","๕","๗","๗","๕","๓","๖","๔","๒","๑","๔"],
    pra_plu: ["๖","๓","๕","๗","๐","น","๓","๖","๔","๒","๑","๔"],
    nij: ["๒","๕","๔","๑","๐","๓","๖","๗","๘","๙"," "," "],
    nij_plu: ["๒","๕","๔","๑","๐","๓","๖","๗","๘","๙","พ","บ"],
    rachachoke: ["๕","๑","๒","๔","๐","๓","๖","๗","๘","๙"," "," "],
    dewechoke: ["๑","๒","๓","๔","๕","๖","๗","๘","๙","๐"," "," "],
    mullkaset: ["๓","๖","๔","๒","๑","๔","๖","๓","๕","๗","๘","๕"],
    julachak: ["๓","๖","๔","๒","๑","๔","๖","๓","๕","๗","๘","๕"]
  };
  function setHouses() {
    Object.keys(HOUSE_IDS).forEach(function(k) {
      var el = document.getElementById(HOUSE_IDS[k]);
      if (el) el.style.display = 'none';
    });
    if (!O.showHouses) return;
    var id = HOUSE_IDS[O.houseMode] || HOUSE_IDS.lux;
    var el = document.getElementById(id);
    if (el) el.style.display = 'block';
  }
  function setStd() {
    var root = document.getElementById('cn_std');
    if (root) root.style.display = O.showStd ? 'block' : 'none';
    if (!O.showStd) return;
    var fmt = FORMATS[O.stdMode] || FORMATS.A;
    for (var i = 0; i < 12; i++) {
      var cell = document.getElementById('cn_nstd' + i);
      if (!cell) continue;
      var parts = (fmt[i] || ' ').split(',');
      cell.textContent = parts.join('');
    }
  }
  function setOuter() {
    var tsign = document.getElementById('cn_tsign');
    if (tsign) tsign.style.display = O.showOuter ? 'block' : 'none';
  }
  function apply() {
    setHouses();
    setStd();
    setOuter();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
</script>`
}
