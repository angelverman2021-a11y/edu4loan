import re

with open("frontend/src/pages/ComparePage.tsx", "r") as f:
    content = f.read()

# 1. Update activeBanks to use dynamicBanks
active_banks_str = """  const activeBanks = useMemo(() => {
    return selectedIds.map(id => BANKS.find(b => b.id === id)).filter(Boolean) as BankData[];
  }, [selectedIds]);"""

new_active_banks_str = """  const [dynamicBanks, setDynamicBanks] = useState<BankData[]>(BANKS);

  useEffect(() => {
    fetch('http://localhost:5001/api/dataset/interest-rates')
      .then(res => res.json())
      .then(data => {
        if (data?.data) {
          setDynamicBanks(prev => prev.map(bank => {
            const rateData = data.data.find((r: any) => r.loan_product_id && r.loan_product_id.startsWith(bank.id.toUpperCase() + '_EDU'));
            if (rateData) {
              return {
                ...bank,
                minRate: parseFloat(rateData.interest_rate_min),
                maxRate: parseFloat(rateData.interest_rate_max),
              };
            }
            return bank;
          }));
        }
      })
      .catch(console.error);
  }, []);

  const activeBanks = useMemo(() => {
    return selectedIds.map(id => dynamicBanks.find(b => b.id === id)).filter(Boolean) as BankData[];
  }, [selectedIds, dynamicBanks]);"""

content = content.replace(active_banks_str, new_active_banks_str)

# 2. Update globalRateChartData to also use dynamicBanks instead of BANKS
global_rate_str = """  const globalRateChartData = useMemo(() => {
    return [...BANKS]
      .sort((a, b) => a.minRate - b.minRate)
      .map((b) => ({
        name: b.shortName,
        'Min Rate': b.minRate,
        'Max Rate': b.maxRate,
        color: b.hexColor
      }));
  }, []);"""

new_global_rate_str = """  const globalRateChartData = useMemo(() => {
    return [...dynamicBanks]
      .sort((a, b) => a.minRate - b.minRate)
      .map((b) => ({
        name: b.shortName,
        'Min Rate': b.minRate,
        'Max Rate': b.maxRate,
        color: b.hexColor
      }));
  }, [dynamicBanks]);"""

content = content.replace(global_rate_str, new_global_rate_str)

# 3. Fix the addDropdown logic to use dynamicBanks so the dropdown options show the current data
# Actually the dropdown options use `BANKS.map(...)` for the full list of available banks, which is fine to stay as BANKS or dynamicBanks.
# Let's change BANKS.map to dynamicBanks.map in the select options just in case.
content = content.replace("{BANKS.map(b => (", "{dynamicBanks.map(b => (")

with open("frontend/src/pages/ComparePage.tsx", "w") as f:
    f.write(content)
