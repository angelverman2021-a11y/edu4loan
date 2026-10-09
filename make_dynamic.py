import re

with open("frontend/src/pages/ComparePage.tsx", "r") as f:
    content = f.read()

# 1. We need to introduce state for dynamicBanks inside ComparePage component
# Let's find: `export default function ComparePage() {`
# and insert `const [dynamicBanks, setDynamicBanks] = useState<BankData[]>(BANKS);`
# and the `useEffect` for polling

useEffect_code = """
  const [dynamicBanks, setDynamicBanks] = useState<BankData[]>(BANKS);

  useEffect(() => {
    const fetchRates = () => {
      fetch('http://localhost:5001/api/dataset/interest-rates')
        .then(res => res.json())
        .then(data => {
          if (data?.data) {
            setDynamicBanks(prev => {
              let changed = false;
              const next = prev.map(bank => {
                const rateData = data.data.find((r: any) => r.loan_product_id && r.loan_product_id.startsWith(bank.id.toUpperCase() + '_EDU'));
                if (rateData) {
                  const newMin = parseFloat(rateData.interest_rate_min);
                  const newMax = parseFloat(rateData.interest_rate_max);
                  if (bank.minRate !== newMin || bank.maxRate !== newMax) {
                    changed = true;
                    return { ...bank, minRate: newMin, maxRate: newMax };
                  }
                }
                return bank;
              });
              return changed ? next : prev;
            });
          }
        })
        .catch(err => console.error("Error polling rates:", err));
    };

    fetchRates();
    const interval = setInterval(fetchRates, 3000);
    return () => clearInterval(interval);
  }, []);
"""

if "const [dynamicBanks, setDynamicBanks]" not in content:
    content = content.replace(
        "export default function ComparePage() {",
        "export default function ComparePage() {\n" + useEffect_code
    )

# 2. Update activeBanks to use dynamicBanks instead of BANKS
# Original: const activeBanks = useMemo(() => BANKS.filter((b) => selected.has(b.id)), [selected]);
content = re.sub(
    r"const activeBanks = useMemo\(\(\) => BANKS\.filter\(\(b\) => selected\.has\(\{?b\.id\}?\)\), \[selected\]\);",
    "const activeBanks = useMemo(() => dynamicBanks.filter((b) => selected.has(b.id)), [selected, dynamicBanks]);",
    content
)

# 3. Update globalRateChartData to use dynamicBanks instead of BANKS
# Original: return [...BANKS]
content = re.sub(
    r"const globalRateChartData = useMemo\(\(\) => \{\n\s*return \[\.\.\.BANKS\]",
    "const globalRateChartData = useMemo(() => {\n    return [...dynamicBanks]",
    content
)

# And add dynamicBanks to its dependency array
content = re.sub(
    r"\}, \[\]\);",
    "}, [dynamicBanks]);",
    content
)

with open("frontend/src/pages/ComparePage.tsx", "w") as f:
    f.write(content)

