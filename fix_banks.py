import re
import json

with open("frontend/src/pages/ComparePage.tsx", "r") as f:
    content = f.read()

mock_stats = {
  "sbi": {
    "totalLoansGiven": 850000, "outstandingAmountCrores": 12500,
    "yearWiseApplications": [{"year": "2021", "count": 180000}, {"year": "2022", "count": 210000}, {"year": "2023", "count": 240000}],
    "stateWiseApplications": [{"state": "MP", "count": 45000}, {"state": "MH", "count": 60000}, {"state": "DL", "count": 30000}]
  },
  "canara": {
    "totalLoansGiven": 420000, "outstandingAmountCrores": 6200,
    "yearWiseApplications": [{"year": "2021", "count": 90000}, {"year": "2022", "count": 110000}, {"year": "2023", "count": 130000}],
    "stateWiseApplications": [{"state": "MP", "count": 20000}, {"state": "KA", "count": 40000}, {"state": "MH", "count": 25000}]
  },
  "bob": {
    "totalLoansGiven": 490000, "outstandingAmountCrores": 7100,
    "yearWiseApplications": [{"year": "2021", "count": 105000}, {"year": "2022", "count": 125000}, {"year": "2023", "count": 140000}],
    "stateWiseApplications": [{"state": "GJ", "count": 45000}, {"state": "MP", "count": 15000}, {"state": "MH", "count": 35000}]
  }
}

for bank_id, stats in mock_stats.items():
    stat_string = (
        f'totalLoansGiven: {stats["totalLoansGiven"]},\n'
        f'    outstandingAmountCrores: {stats["outstandingAmountCrores"]},\n'
        f'    yearWiseApplications: {json.dumps(stats["yearWiseApplications"])},\n'
        f'    stateWiseApplications: {json.dumps(stats["stateWiseApplications"])},\n'
        f'    note: '
    )
    # Only replace if not already replaced
    if f'totalLoansGiven: {stats["totalLoansGiven"]}' not in content:
        pattern = f"id: '{bank_id}'.*?note: "
        content = re.sub(pattern, lambda m: m.group(0).replace('note: ', stat_string), content, flags=re.DOTALL)

with open("frontend/src/pages/ComparePage.tsx", "w") as f:
    f.write(content)
