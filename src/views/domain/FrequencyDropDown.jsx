import { PeriodUnit } from '../../models/Definitions';

export function FrequencyDropDown({
    value,
    labelProp = 'freqLabel',
    onChange = () => { },
    disabled = true
}) {
    const units = Object.entries(PeriodUnit);

    return (
        <select value={value} onChange={onChange} disabled={disabled}>
            {units.map(([key, u]) => (
                <option key={key} value={key}>{u[labelProp]}</option>
            ))}
        </select>
    );
}