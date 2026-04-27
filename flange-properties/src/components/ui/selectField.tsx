export default function SelectField(props: SelectFieldProps) {
    const selectId = props.label.toLowerCase().replace(/\s+/g, "-") + "-select";

    return (
        <div className="select-field">
            <label className="select-label" htmlFor={selectId}>
                {props.label}
            </label>

            <select
                id={selectId}
                className="select-input"
                value={props.value ?? ""}
                onChange={(e) => props.onChange(e.target.value === "" ? null : e.target.value)}
            >
                <option value="">Select {props.label}</option>
                {props.options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

interface SelectFieldProps {
    label: string;
    options: string[];
    value: string | null;
    onChange: (value: string | null) => void;
}